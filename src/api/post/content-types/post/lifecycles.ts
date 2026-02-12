module.exports = {
  async beforeCreate(event) {
    await ensureMainDate(event);
  },

  async beforeUpdate(event) {
    await ensureMainDate(event);
  },
};

async function ensureMainDate(event) {
  const data = event.params.data || {};
  const uid = event.model.uid;

  // We only care when something is being PUBLISHED.
  // In Strapi 5 drafts have publishedAt = null. :contentReference[oaicite:1]{index=1}
  if (!data.publishedAt) return;

  // If user explicitly set mainDate in this request, DO NOT override it.
  if (data.mainDate) return;

  const documentId = data.documentId;
  const locale = data.locale;

  // If we have a documentId, prefer the DRAFT value first (what user just edited).
  // Document Service returns draft by default; use status to fetch published. :contentReference[oaicite:2]{index=2}
  if (documentId) {
    const draft = await strapi.documents(uid).findOne({
      documentId,
      locale,
      status: "draft",
      fields: ["mainDate"],
    });

    if (draft?.mainDate) {
      data.mainDate = draft.mainDate;
      return;
    }

    const published = await strapi.documents(uid).findOne({
      documentId,
      locale,
      status: "published",
      fields: ["mainDate", "publishedAt"],
    });

    data.mainDate =
      published?.mainDate ?? published?.publishedAt ?? data.publishedAt;
    return;
  }

  // First publish ever (no documentId available for some reason): fall back to publishedAt
  data.mainDate = data.publishedAt;
}
