# db/seeds.rb

ACTIONS = [ 'read', 'create', 'edit', 'move', 'transfer', 'delete' ]
SUBJECTS = [ 'shelf', 'container', 'item' ]

# Create Permissions for each action and subject combination
ACTIONS.each do |action|
  SUBJECTS.each do |subject|
    permission = Permission.find_or_create_by(action: action, subject: subject)
    puts "Created permission: #{permission.action}_#{permission.subject}"
  end
end

ACTIONS_AREA = [ 'read', 'edit', 'transfer', 'delete' ]

# Create Permissions for each action and subject combination for 'area'
ACTIONS_AREA.each do |action|
  permission = Permission.find_or_create_by(action: action, subject: 'area')
  puts "Created permission: #{permission.action}_#{permission.subject}"
end

# Create Admin Role and assign all permissions
admin_role = Role.find_or_create_by(name: 'admin')
permissions = Permission.all
admin_role.permissions << permissions

puts "Assigned all permissions to the Admin role."
