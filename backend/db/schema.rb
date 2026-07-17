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

ActiveRecord::Schema[8.1].define(version: 2026_07_14_000000) do
  create_table "properties", force: :cascade do |t|
    t.string "address", null: false
    t.string "agent_email"
    t.string "agent_name"
    t.string "agent_phone"
    t.integer "bathrooms", default: 0, null: false
    t.integer "bedrooms", default: 0, null: false
    t.string "city"
    t.datetime "created_at", null: false
    t.text "description", null: false
    t.boolean "featured", default: false
    t.string "image_url"
    t.decimal "price", null: false
    t.string "property_type"
    t.decimal "square_feet", default: "0.0", null: false
    t.string "state"
    t.string "status", default: "for_sale"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.string "zip_code"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.boolean "notifications_enabled", default: true, null: false
    t.string "password_digest", null: false
    t.string "phone", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end
end
