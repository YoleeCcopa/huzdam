class Container < ApplicationRecord
  belongs_to :shelf
  has_many :items, dependent: :destroy
end
