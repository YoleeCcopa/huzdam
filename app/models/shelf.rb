class Shelf < ApplicationRecord
  belongs_to :user
  belongs_to :area, optional: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, presence: true

  def all_containers
    Container.where(parent: self).or(Container.where(parent: containers))
  end

  def all_items
    Item.where(parent: self).or(Item.where(parent: containers))
  end
end
