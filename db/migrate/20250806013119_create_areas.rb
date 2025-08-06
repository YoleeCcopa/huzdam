class CreateAreas < ActiveRecord::Migration[8.0]
  def change
    create_table :areas do |t|
      t.references :user, null: false, foreign_key: true  # owner
      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    # Optional: add reference in shelves
    add_reference :shelves, :area, foreign_key: true
  end
end
