class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_secure_password validations: true  # this uses `password_digest`, see note below

  validates :email, presence: true, uniqueness: true
  validates :user_name, presence: true
end
