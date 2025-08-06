class Roles < ActiveRecord::Migration[8.0]
  def change
    create_table :roles do |t|
      t.string :name, null: false
      t.timestamps
    end

    add_index :roles, :name, unique: true

    create_table :permissions do |t|
      t.string :action, null: false    # e.g. "read", "create", etc.
      t.string :subject, null: false   # e.g. "shelf", "container", "item"
      t.timestamps
    end

    create_table :permissions_roles, id: false do |t|
      t.belongs_to :role
      t.belongs_to :permission
    end

    add_reference :users, :role, foreign_key: true

    create_table :user_roles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :role, null: false, foreign_key: true
      t.references :object, polymorphic: true, null: false

      t.timestamps
    end

    add_index :user_roles, [ :user_id, :object_type, :object_id ], unique: true, name: "index_user_roles_on_user_and_object"

    create_table :denied_accesses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :object, polymorphic: true, null: false

      t.timestamps
    end

    add_index :denied_accesses, [ :user_id, :object_type, :object_id ], unique: true, name: "index_denied_accesses_on_user_and_object"
  end
end
