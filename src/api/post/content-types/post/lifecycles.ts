export default {
  async beforeCreate(event) {
    const data = event.params.data as any;
    if (!data?.publishedAt) return; // draft has publishedAt = null :contentReference[oaicite:3]{index=3}
    if (data.mainDate) return; // already set

    const documentId = data.documentId;
    const locale = data.locale;

    // Try to keep the original stable date from an existing published version
    if (documentId) {
      const existingPublished = await strapi
        .documents(event.model.uid)
        .findOne({
          documentId,
          locale,
          status: "published",
          fields: ["mainDate", "publishedAt"],
        });

      data.mainDate =
        existingPublished?.mainDate ??
        existingPublished?.publishedAt ??
        data.publishedAt;
    } else {
      data.mainDate = data.publishedAt;
    }
  },

  async beforeUpdate(event) {
    const data = event.params.data as any;
    if (!data?.mainDate) return;

    // Prevent accidentally changing it later:
    const existing = await strapi.db.query(event.model.uid).findOne({
      where: event.params.where,
      select: ["mainDate"],
    });

    data.mainDate = (existing as any)?.mainDate ?? data.mainDate;
  },
};
