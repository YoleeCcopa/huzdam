class Shelf < ApplicationRecord
  belongs_to :user
  belongs_to :area, optional: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, :description, presence: true

  # All containers under this shelf (direct + one level nested)
  def all_containers
    Container.where(parent: self)
             .or(Container.where(parent: containers))
  end

  # All items under this shelf (direct + containers)
  def all_items
    Item.where(parent: self)
        .or(Item.where(parent: containers))
  end
end
