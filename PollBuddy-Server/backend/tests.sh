# Tests adding a new group
curl -d '{"Name": "testgrouplol"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/new

# Tests adding an instructor to a group. Grab the ID for the group and instructor and put it in here
curl -d '{"Action": "Add", "InstructorID": "5dc1f6479be28d000941338b"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/5dcb29999bdb5d0008c3a907/edit

# Tests adding a poll to the group. Grab things same as above.
curl -d '{"Action": "Add", "PollID": "5dc1f6479be28d000941338f"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/5dcb29999bdb5d0008c3a907/edit

# Tests adding a user to the group. Grab things same as above.
curl -d '{"Action": "Add", "UserID": "5dc1f6479be28d000941338a"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/5dcb29999bdb5d0008c3a907/edit

# Tests removing an instructor from a group. Grab the ID for the group and instructor and put it in here
curl -d '{"Action": "Remove", "InstructorID": "5dc1f6479be28d000941338b"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/5dcb29999bdb5d0008c3a907/edit

# Tests removing a poll from the group. Grab things same as above.
curl -d '{"Action": "Remove", "PollID": "5dc1f6479be28d000941338f"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/5dcb29999bdb5d0008c3a907/edit

# Tests removing a user from the group. Grab things same as above.
curl -d '{"Action": "Remove", "UserID": "5dc1f6479be28d000941338a"}' -H "Content-Type: application/json" -X POST http://localhost:3001/api/groups/5dcb29999bdb5d0008c3a907/edit

