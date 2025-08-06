class Shelf < ApplicationRecord
  belongs_to :user
  belongs_to :area

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, :description, presence: true

  # All containers nested inside this shelf (recursive)
  def all_containers
    Container.recursive_descendants(self)
  end

  # All items inside this shelf or any nested containers
  def all_items
    Item.where(parent: self)
        .or(Item.where(parent: all_containers))
  end
end
