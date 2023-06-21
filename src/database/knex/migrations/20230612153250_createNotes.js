exports.up = knex => knex.schema.createTable("notes", table => {
  table.increments("id");
  table.string("name");
  table.string("avatar");
  table.integer("age");
  table.string("gender");
  table.string("form");
  table.integer("height");
  table.integer("weight");
  table.string("description");
  table.string("style");
  table.string("goals");
  table.integer("user_id").references("id").inTable("users");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
}); 


exports.down = knex => knex.schema.dropTable("notes");
