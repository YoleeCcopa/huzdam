class Shelf < ApplicationRecord
  belongs_to :user
  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy
end
