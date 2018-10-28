- refactor out S from interface - use property functions
- store activities state 
  - filters in task list views
  - texts in create boxes for task and label
  - selected task list
  - selected task
  - edit task title?


task list activity view:
- make possible to add or remove view
- make possible to reorder view
- use color of first label in query text box as color of view title

label edit:
- make possible to rename label
- make possible to delete label
- make possible to change label color
- when renaming and removing label, update all queries

adding new task:
- if the text-box contains label reference that does not exists, create the label
- assign all existing labels which are used in the text-box for the new task
- remove the label reference from value of text-box before using it as task title

search references:
- make possible to create search from query
- make possible to rename search
- make possible to delete search
- make possible to change search color
- include/exclude search reference in query when activated

polish - storage:
- optimize local storage to store by element-id as key

polish - task lists:
- fix focus on last (not selected) task list activity text-box when clicked on label to query it
- make possible to change title color of view to custom
- align label tags to right
- resize query text box to view width
- make views in same column equal width
- 'clear' button design

polish:
- resizing panels - set minimal width, check with resizing to big size
- resizing panels - resize also content elements - check for multiple resizes

future:
- make possible to see task creation date time
- make possible to see task's last completion date time
- server storage
- sync resolving 
- allow to link children labels into parent label

queries:
- implement negation
- implement or in queries. emphasis or-red labels differently than and-ned
- implement braces in queries
