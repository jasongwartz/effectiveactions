const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "keyRPtrDfbRcbRCPA",
});
const base = Airtable.base("appW04rbe6P6gP5wR");

console.log("loaded airtable");

const airtableMiddleware = (app) => {
  app.post("/solutions", (req, res) => {

    const filters = req.body;

    console.log("filters",filters);

    const order = (typeof filters.order === 'string')
    && (filters.order.toLowerCase() === 'asc'|| filters.order.toLowerCase() === 'desc')
    ? filters.order.toLowerCase()
    : 'asc';

    let sorting = [];
    sorting = Array.isArray(filters.sort)
      ? filters.sort.map((item) => {
        return {field: item, direction: order }
      })
      : [];

    // { field: "Name", direction: "asc" },

    console.log("sort",sorting)

    let accumulator = [];
    base("Solutions")
      .select({
        maxRecords: 9,
        view: "All Solutions",
        fields: [
          "Name",
          "Summary",
          "Featured",
          "Link",
          "Media",
          "Type",
          "Challenges addressed",
          "Stage",
        ],
        // filterByFormula: "({Featured} = true)",
        pageSize: 100,
        sort: sorting,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            console.log("Retrieved", record.get("Name"));
            accumulator.push(record._rawJson);
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          return res.status(200).json({
            records: accumulator,
          });
        }
      );
  });
};

exports.airtableMiddleware = airtableMiddleware;
