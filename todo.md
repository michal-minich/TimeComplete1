- import json file

searches:
- rest task and label summary footer
- automaticaly list all task list view as searches in left panel
- allow them to be named, then the name will be in the header of the view, on click ti will be exapnded to full search
- when name of search is used in the search view itsefl, new unamed serarch will be created on save, original will remaing unchanged

- refactor task queries tobe reactive (use parsed references which are reactive(?))

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

polish - labels:
- implement label color styling - bw / invert / custom
- add color picker

polish - storage:
- optimize local storage to store by element-id as key

polish - store activities state 
  - selected task list
  - edit task title?

polish - task lists:
- fix focus on last (not selected) task list activity text-box when clicked on label to query it
- make possible to change title color of view to custom
- align label tags to right
- resize query text box to view width
- make views in same column equal width
- 'clear' button design
- make possible to reorder view

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
