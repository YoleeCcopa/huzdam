class Container < ApplicationRecord
  belongs_to :user
  belongs_to :parent, polymorphic: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy
end
