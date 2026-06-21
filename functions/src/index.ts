import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

async function isAdmin(uid: string): Promise<boolean> {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists && userDoc.data()?.role === "admin";
}

async function incrementStatsOnPublish(
  colName: "resources" | "admission_resources"
) {
  const statsField =
    colName === "resources" ? "totalResources" : "admissionItems";
  await db
    .collection("stats")
    .doc("summary")
    .set(
      {
        [statsField]: admin.firestore.FieldValue.increment(1),
        totalFiles: admin.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );
}

async function decrementStatsOnDelete(
  colName: "resources" | "admission_resources"
) {
  const statsField =
    colName === "resources" ? "totalResources" : "admissionItems";
  await db
    .collection("stats")
    .doc("summary")
    .set(
      {
        [statsField]: admin.firestore.FieldValue.increment(-1),
        totalFiles: admin.firestore.FieldValue.increment(-1),
      },
      { merge: true }
    );
}

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const existing = await db.collection("users").doc(user.uid).get();
  if (existing.exists) return;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase() ?? "";
  const role =
    adminEmail && userEmail === adminEmail ? "admin" : "student";

  await db.collection("users").doc(user.uid).set({
    name: user.displayName || user.email?.split("@")[0] || "Student",
    email: user.email,
    campus: "",
    role,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db
    .collection("stats")
    .doc("summary")
    .set(
      { registeredUsers: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );
});

export const onResourcePublish = functions.firestore
  .document("resources/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status !== "published" && after.status === "published") {
      await incrementStatsOnPublish("resources");
    }
  });

export const onAdmissionResourcePublish = functions.firestore
  .document("admission_resources/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status !== "published" && after.status === "published") {
      await incrementStatsOnPublish("admission_resources");
    }
  });

export const approveUpload = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in");
  }
  if (!(await isAdmin(request.auth.uid))) {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }

  const { resourceId, collection: colName } = request.data as {
    resourceId: string;
    collection: "resources" | "admission_resources";
  };

  const ref = db.collection(colName).doc(resourceId);
  const doc = await ref.get();
  if (!doc.exists) {
    throw new functions.https.HttpsError("not-found", "Resource not found");
  }

  await ref.update({
    status: "published",
    reviewed_by: request.auth.uid,
    published_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

export const rejectUpload = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in");
  }
  if (!(await isAdmin(request.auth.uid))) {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }

  const { resourceId, collection: colName, reason } = request.data as {
    resourceId: string;
    collection: "resources" | "admission_resources";
    reason?: string;
  };

  await db.collection(colName).doc(resourceId).update({
    status: "rejected",
    rejection_reason: reason || "Does not meet content policy",
    reviewed_by: request.auth.uid,
    reviewed_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

export const publishFaqAnswer = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in");
  }
  if (!(await isAdmin(request.auth.uid))) {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }

  const { faqId, answer } = request.data as { faqId: string; answer: string };

  await db.collection("faqs").doc(faqId).update({
    answer,
    status: "published",
    answered_by: request.auth.uid,
    answered_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

export const incrementDownloadCount = functions.https.onCall(async (request) => {
  const { resourceId, collection: colName } = request.data as {
    resourceId: string;
    collection: "resources" | "admission_resources";
  };

  if (!resourceId || !colName) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields");
  }

  const doc = await db.collection(colName).doc(resourceId).get();
  if (!doc.exists || doc.data()?.status !== "published") {
    throw new functions.https.HttpsError("not-found", "Resource not found");
  }

  await doc.ref.update({
    downloads: admin.firestore.FieldValue.increment(1),
  });

  return { success: true };
});

export const recomputeStatsNightly = functions.scheduler
  .onSchedule("every 24 hours", async () => {
    const [resources, admission, events, societies, users] = await Promise.all([
      db.collection("resources").where("status", "==", "published").count().get(),
      db
        .collection("admission_resources")
        .where("status", "==", "published")
        .count()
        .get(),
      db.collection("events").count().get(),
      db.collection("societies").count().get(),
      db.collection("users").count().get(),
    ]);

    await db.collection("stats").doc("summary").set({
      totalResources: resources.data().count,
      admissionItems: admission.data().count,
      totalFiles: resources.data().count + admission.data().count,
      campusEvents: events.data().count,
      societies: societies.data().count,
      registeredUsers: users.data().count,
    });
  });

export const onResourceDelete = functions.firestore
  .document("resources/{id}")
  .onDelete(async (snap) => {
    if (snap.data()?.status === "published") {
      await decrementStatsOnDelete("resources");
    }
  });

export const onAdmissionResourceDelete = functions.firestore
  .document("admission_resources/{id}")
  .onDelete(async (snap) => {
    if (snap.data()?.status === "published") {
      await decrementStatsOnDelete("admission_resources");
    }
  });
