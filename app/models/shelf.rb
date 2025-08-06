class Shelf < ApplicationRecord
  belongs_to :user
  belongs_to :area, optional: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, :description, presence: true

  # All containers under this shelf (direct)
  def all_containers
    Container.where(parent_type: "Shelf", parent_id: id)
  end

  # All items under this shelf (direct + from containers)
  def all_items
    Item.where(
      "(parent_type = ? AND parent_id = ?) OR (parent_type = ? AND parent_id IN (?))",
      "Shelf", id,
      "Container", all_containers.select(:id)
    )
  end
end
