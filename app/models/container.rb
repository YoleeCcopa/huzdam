class Container < ApplicationRecord
  belongs_to :user
  belongs_to :parent, polymorphic: true, optional: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, :description, presence: true

  # All containers nested inside this container (direct)
  def all_containers
    Container.where(parent_type: "Container", parent_id: id)
  end

  # All items under this container (direct + from child containers)
  def all_items
    Item.where(
      "(parent_type = ? AND parent_id = ?) OR (parent_type = ? AND parent_id IN (?))",
      "Container", id,
      "Container", all_containers.select(:id)
    )
  end
end
