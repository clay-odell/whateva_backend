/**
 * Generate a partial SQL query for inserting fields dynamically
 * @param {Object} fields - An object representing the fields to insert
 * @returns {Object} - An object containing the column names and the values array
 */
const partialForSqlInsert = (fields) => {
    const keys = Object.keys(fields);
    const columnNames = keys.join(", ");
    const values = Object.values(fields);
  
    return {
      columnNames,
      values,
    };
  };
  
  module.exports = partialForSqlInsert;
  