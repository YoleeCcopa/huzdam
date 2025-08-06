class ObjectsTable < ActiveRecord::Migration[8.0]
  def change
    create_table :shelves do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.text :template

      t.timestamps
    end

    create_table :containers do |t|
      t.references :user, null: false, foreign_key: true

      # Parent can be a shelf or another container
      t.references :parent, polymorphic: true, null: false

      t.string :name, null: false
      t.text :description
      t.text :template

      t.timestamps
    end

    create_table :items do |t|
      t.references :user, null: false, foreign_key: true

      # Parent can be a shelf or a container
      t.references :parent, polymorphic: true, null: false

      t.string :name, null: false
      t.string :custom_label
      t.text :description

      t.timestamps
    end
  end
end
