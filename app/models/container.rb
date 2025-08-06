class Container < ApplicationRecord
  belongs_to :user
  belongs_to :parent, polymorphic: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, presence: true

  def all_containers
    containers + containers.flat_map(&:all_containers)
  end

  def all_items
    items + containers.flat_map(&:all_items)
  end
end
