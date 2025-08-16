# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_15_210039) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "areas", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_areas_on_user_id"
  end

  create_table "containers", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "parent_type"
    t.bigint "parent_id"
    t.string "name", null: false
    t.text "description"
    t.text "template"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_type", "parent_id"], name: "index_containers_on_parent"
    t.index ["user_id"], name: "index_containers_on_user_id"
  end

  create_table "denied_accesses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "object_type", null: false
    t.bigint "object_id", null: false
    t.boolean "hidden", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["object_type", "object_id"], name: "index_denied_accesses_on_object"
    t.index ["user_id", "object_type", "object_id"], name: "index_denied_accesses_on_user_and_object", unique: true
    t.index ["user_id"], name: "index_denied_accesses_on_user_id"
  end

  create_table "item_properties", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.bigint "property_id", null: false
    t.text "value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_item_properties_on_item_id"
    t.index ["property_id"], name: "index_item_properties_on_property_id"
  end

  create_table "item_tags", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_item_tags_on_item_id"
    t.index ["tag_id"], name: "index_item_tags_on_tag_id"
  end

  create_table "items", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "parent_type"
    t.bigint "parent_id"
    t.string "name", null: false
    t.string "custom_label"
    t.text "description"
    t.boolean "is_stackable", default: false
    t.integer "quantity", default: 1
    t.decimal "buy_price", precision: 10, scale: 2
    t.decimal "sell_value", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_type", "parent_id"], name: "index_items_on_parent"
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "permissions", force: :cascade do |t|
    t.string "action", null: false
    t.string "subject", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "permissions_roles", id: false, force: :cascade do |t|
    t.bigint "role_id", null: false
    t.bigint "permission_id", null: false
    t.index ["permission_id"], name: "index_permissions_roles_on_permission_id"
    t.index ["role_id"], name: "index_permissions_roles_on_role_id"
  end

  create_table "properties", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "value_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_properties_on_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "shelves", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "parent_type"
    t.bigint "parent_id"
    t.string "name", null: false
    t.text "description"
    t.text "template"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_type", "parent_id"], name: "index_shelves_on_parent"
    t.index ["user_id"], name: "index_shelves_on_user_id"
  end

  create_table "tag_properties", force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.bigint "property_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_tag_properties_on_property_id"
    t.index ["tag_id"], name: "index_tag_properties_on_tag_id"
  end

  create_table "tags", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "parent_id"
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_tags_on_parent_id"
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.string "object_type", null: false
    t.bigint "object_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["object_type", "object_id"], name: "index_user_roles_on_object"
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id", "object_type", "object_id"], name: "index_user_roles_on_user_and_object", unique: true
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "magic_login_token"
    t.datetime "magic_login_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "user_name", null: false
    t.string "display_name"
    t.string "email", null: false
    t.string "image"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "role_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["magic_login_token"], name: "index_users_on_magic_login_token", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
    t.index ["user_name"], name: "index_users_on_user_name", unique: true
  end

  add_foreign_key "areas", "users"
  add_foreign_key "containers", "users"
  add_foreign_key "denied_accesses", "users"
  add_foreign_key "item_properties", "items"
  add_foreign_key "item_properties", "properties"
  add_foreign_key "item_tags", "items"
  add_foreign_key "item_tags", "tags"
  add_foreign_key "items", "users"
  add_foreign_key "properties", "users"
  add_foreign_key "shelves", "users"
  add_foreign_key "tag_properties", "properties"
  add_foreign_key "tag_properties", "tags"
  add_foreign_key "tags", "tags", column: "parent_id"
  add_foreign_key "tags", "users"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
  add_foreign_key "users", "roles"
end
