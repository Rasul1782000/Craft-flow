class CreateProperties < ActiveRecord::Migration[8.1]
  def change
    create_table :properties do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.decimal :price, null: false
      t.string :address, null: false
      t.string :city
      t.string :state
      t.string :zip_code
      t.integer :bedrooms, null: false, default: 0
      t.integer :bathrooms, null: false, default: 0
      t.decimal :square_feet, null: false, default: 0
      t.string :property_type
      t.string :status, default: "for_sale"
      t.boolean :featured, default: false
      t.string :image_url
      t.string :agent_name
      t.string :agent_phone
      t.string :agent_email

      t.timestamps
    end
  end
end
