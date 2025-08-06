class Area < ApplicationRecord
  belongs_to :user    # owner
  has_many :shelves, dependent: :destroy

  validates :name, presence: true

  # All shelves in this area
  def all_shelves
    shelves
  end

  # All containers in this area
  def all_containers
    Container.where(parent: shelves)
  end

  # All items in this area
  def all_items
    Item.where(parent: shelves).or(Item.where(parent: Container.where(parent: shelves)))
  end
end