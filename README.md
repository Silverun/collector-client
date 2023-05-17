### Description:

This is a CRUD website that allows its users to create and manage collections of different collectable items like books or coins. Each item in given collection can have various number of custom user defined fields to describe it, which are set during collection creation. Users can add items to collections, edit, update and delete them. Also they have the ability to view other users items, like them and write comments.</br>
There are 3 roles - admins, users and viewers. Admins can alter site content as the owner of the content, as well as manage users - block, unblock, delete, promote to admin or demote. Users are the ones that are registered and can perform basic actions like creating content and so on. Viewers can only browse site content.</br>
Site features full text search for item names, item labels, comments and item field like description. It also has multi-language support, dark mode.

<p>Showcase video:</p>
<a href="http://www.youtube.com/watch?feature=player_embedded&v=CDKR5RtVoWE" target="_blank">
 <img src="http://img.youtube.com/vi/CDKR5RtVoWE/hqdefault.jpg" alt="Watch the video" width="240" height="180" border="10" />
</a>

### Main stack used:

- JavaScript
- React + Router
- Bootstrap / React Bootstrap
- Express
- MySQL + Sequelize

### Secondary tech:

- JWT and HTTP only cookies for authorization
- Protected routes
- i18 for internalization
- Minisearch for full text search

[Link to deployed app](https://cltr.netlify.app/) (you might need to wait a bit and refresh for render server to spin up)
