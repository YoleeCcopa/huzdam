class DbSchema < ActiveRecord::Migration[8.0]
  def change
    drop_table :tag_properties
    drop_table :item_properties
    drop_table :properties
    drop_table :item_tags
    drop_table :tags
    drop_table :items
    drop_table :containers
    drop_table :shelves
    drop_table :areas
    drop_table :denied_accesses
    drop_table :user_roles
    drop_table :permissions_roles
    drop_table :permissions
    drop_table :users
    drop_table :roles

    create_table(:users) do |t|
      ## Required
      t.string :provider, null: false, default: "email"
      t.string :uid, null: false, default: ""
      ## Database authenticatable
      t.string :encrypted_password, null: false, default: ""
      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at
      t.string   :magic_login_token
      t.datetime :magic_login_sent_at
      t.boolean  :allow_password_change, default: false
      ## Rememberable
      t.datetime :remember_created_at
      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email # Only if using reconfirmable
      ## User Info
      t.string :user_name, null: false
      t.string :display_name
      t.string :email, null: false
      t.string :image
      ## Tokens
      t.json :tokens

      t.timestamps
    end

    add_index :users, :email,                 unique: true
    add_index :users, :user_name,             unique: true
    add_index :users, [ :uid, :provider ],    unique: true
    add_index :users, :reset_password_token,  unique: true
    add_index :users, :magic_login_token,     unique: true
    add_index :users, :confirmation_token,    unique: true

    # Optional: mark existing users as confirmed
    User.update_all(confirmed_at: Time.current)

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
      t.belongs_to :role, null: false
      t.belongs_to :permission, null: false
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
      t.boolean :hidden, default: true

      t.timestamps
    end

    add_index :denied_accesses, [ :user_id, :object_type, :object_id ], unique: true, name: "index_denied_accesses_on_user_and_object"

    create_table :areas do |t|
      t.references :user, null: false, foreign_key: true  # owner
      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    create_table :shelves do |t|
      t.references :user, null: false, foreign_key: true

      # Parent can be a shelf or another container
      t.references :parent, polymorphic: true

      t.string :name, null: false
      t.text :description
      t.text :template

      t.timestamps
    end

    create_table :containers do |t|
      t.references :user, null: false, foreign_key: true

      # Parent can be a shelf or another container
      t.references :parent, polymorphic: true

      t.string :name, null: false
      t.text :description
      t.text :template

      t.timestamps
    end

    create_table :items do |t|
      t.references :user, null: false, foreign_key: true

      # Parent can be a shelf or a container
      t.references :parent, polymorphic: true

      t.string :name, null: false
      t.string :custom_label
      t.text :description
      t.boolean :is_stackable, default: false
      t.integer :quantity, default: 1
      t.decimal :buy_price, precision: 10, scale: 2
      t.decimal :sell_value, precision: 10, scale: 2

      t.timestamps
    end

    create_table :tags do |t|
      t.references :user, null: false, foreign_key: true
      t.references :parent, foreign_key: { to_table: :tags }, index: true

      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    create_table :item_tags do |t|
      t.references :item, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end

    create_table :properties do |t|
      t.references :user, null: false, foreign_key: true

      t.string :name, null: false
      t.string :value_type, null: false  # "string", "number", "boolean", etc.

      t.timestamps
    end

    create_table :item_properties do |t|
      t.references :item, null: false, foreign_key: true
      t.references :property, null: false, foreign_key: true

      # This is the actual value of the property for the item
      t.text :value, null: false

      t.timestamps
    end

    create_table :tag_properties do |t| # Tag-scoped metadata
      t.references :tag, null: false, foreign_key: true
      t.references :property, null: false, foreign_key: true

      t.timestamps
    end
  end
end
