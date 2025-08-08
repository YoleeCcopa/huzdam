class Role < ApplicationRecord
  has_many :permissions_roles
  has_many :permissions, through: :permissions_roles

  has_many :user_roles, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
