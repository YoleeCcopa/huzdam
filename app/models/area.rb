class Area < ApplicationRecord
  belongs_to :user

  has_many :shelves, dependent: :destroy

  validates :name, :description, presence: true

  # All containers nested inside all shelves of this area
  def all_containers
    Container.where(parent: shelves)
             .or(Container.where(parent: Container.where(parent: shelves)))
  end

  # All items inside shelves or their containers
  def all_items
    Item.where(parent: shelves)
        .or(Item.where(parent: all_containers))
  end
end
