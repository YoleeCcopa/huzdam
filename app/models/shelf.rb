class Shelf < ApplicationRecord
  has_many :containers, dependent: :destroy
end
