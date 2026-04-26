const USERS = [
  { id:1, username:"ahmed_pk", name:"Ahmed Khan", avatar:"https://i.pravatar.cc/150?img=1", bio:"Photographer", posts:42, followers:1200, following:300, password:"1234" },
  { id:2, username:"sara_official", name:"Sara Ali", avatar:"https://i.pravatar.cc/150?img=5", bio:"Travel lover", posts:87, followers:5400, following:210, password:"1234" },
  { id:3, username:"zain_codes", name:"Zain Ahmed", avatar:"https://i.pravatar.cc/150?img=3", bio:"Developer", posts:15, followers:890, following:450, password:"1234" },
  { id:4, username:"nadia_art", name:"Nadia Malik", avatar:"https://i.pravatar.cc/150?img=9", bio:"Artist", posts:63, followers:3200, following:180, password:"1234" },
  { id:5, username:"bilal_fit", name:"Bilal Fitness", avatar:"https://i.pravatar.cc/150?img=7", bio:"Fitness Coach", posts:120, followers:8900, following:500, password:"1234" }
];

const POSTS = [
  { id:1, userId:2, image:"https://picsum.photos/seed/post1/600/600", caption:"Beautiful sunset! #travel #nature", likes:342, liked:false, saved:false, time:"2 hours ago", comments:[{userId:1,text:"Stunning!"},{userId:3,text:"Where is this?"}] },
  { id:2, userId:3, image:"https://picsum.photos/seed/post2/600/600", caption:"Late night coding session #developer", likes:128, liked:false, saved:false, time:"5 hours ago", comments:[{userId:4,text:"Same!"},{userId:5,text:"Coffee is life"}] },
  { id:3, userId:4, image:"https://picsum.photos/seed/post3/600/600", caption:"New artwork finished! #art #creative", likes:567, liked:false, saved:false, time:"1 day ago", comments:[{userId:2,text:"Amazing!"},{userId:1,text:"Love the colors"}] },
  { id:4, userId:5, image:"https://picsum.photos/seed/post4/600/600", caption:"Morning workout done! #fitness #gym", likes:891, liked:false, saved:false, time:"2 days ago", comments:[{userId:3,text:"Goals!"},{userId:2,text:"Inspiring!"}] },
  { id:5, userId:1, image:"https://picsum.photos/seed/post5/600/600", caption:"Golden hour photography #photography", likes:234, liked:false, saved:false, time:"3 days ago", comments:[{userId:4,text:"Perfect shot!"},{userId:5,text:"Fire!"}] }
];

let currentUser = null;
let posts = [...POSTS];
let users = [...USERS];
let messages = {};
let activeChatId = null;

const App = {
  showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  login() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value.trim();
    const found = users.find(x => (x.username === u || x.name === u) && x.password === p);
    if (!found) { App.toast('Wrong username or password!'); return; }
    currentUser = found;
    App.initApp();
    App.showPage('mainApp');
  },

  signup() {
    const email = document.getElementById('signupEmail').value.trim();
    const name = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUser').value.trim();
    const pass = document.getElementById('signupPass').value.trim();
    if (!email || !name || !username || !pass) { App.toast('Please fill all fields!'); return; }
    if (users.find(x => x.username === username)) { App.toast('Username already taken!'); return; }
    const newUser = { id: users.length+1, username, name, avatar: 'https://i.pravatar.cc/150?img=' + (users.length+10), bio: '', posts: 0, followers: 0, following: 0, password: pass };
    users.push(newUser);
    currentUser = newUser;
    App.initApp();
    App.showPage('mainApp');
  },

  initApp() {
    document.getElementById('navPic').src = currentUser.avatar;
    document.getElementById('bottomPic').src = currentUser.avatar;
    document.getElementById('msgUsername').textContent = currentUser.username;
    App.renderStories();
    App.renderFeed();
    App.renderSidebar();
    App.renderExplore();
    App.renderNotifications();
    App.renderMessages();
    App.renderProfile();
  },

  showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(name + 'Section').classList.add('active');
    if (name === 'profile') App.renderProfile();
  },

  renderStories() {
    const box = document.getElementById('storiesBox');
    box.innerHTML = users.map(u => `
      <div class="story-item" onclick="App.toast('${u.name} ki story!')">
        <div class="story-ring"><img src="${u.avatar}" alt="${u.username}"/></div>
        <span class="story-name">${u.id === currentUser.id ? 'Your Story' : u.username}</span>
      </div>`).join('');
  },

  renderFeed() {
    const container = document.getElementById('feedPosts');
    container.innerHTML = posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return `
      <div class="post-card" id="post-${post.id}">
        <div class="post-head">
          <img src="${user.avatar}" alt="${user.username}" onclick="App.viewUser(${user.id})"/>
          <span class="post-uname" onclick="App.viewUser(${user.id})">${user.username}</span>
          <i class="fas fa-ellipsis-h" style="cursor:pointer"></i>
        </div>
        <img class="post-img" src="${post.image}" alt="post" onclick="App.openPost(${post.id})"/>
        <div class="post-actions">
          <button class="act-btn ${post.liked ? 'liked' : ''}" onclick="App.toggleLike(${post.id})">
            <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <button class="act-btn" onclick="App.openPost(${post.id})"><i class="far fa-comment"></i></button>
          <button class="act-btn"><i class="far fa-paper-plane"></i></button>
          <button class="act-btn act-save" onclick="App.toggleSave(${post.id})">
            <i class="${post.saved ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
        </div>
        <div class="post-likes">${post.likes.toLocaleString()} likes</div>
        <div class="post-caption"><strong onclick="App.viewUser(${user.id})">${user.username}</strong> ${post.caption}</div>
        ${post.comments.length ? '<div class="post-comments-link" onclick="App.openPost(' + post.id + ')">View all ' + post.comments.length + ' comments</div>' : ''}
        <div class="post-time">${post.time}</div>
        <div class="post-comment-row">
          <input type="text" placeholder="Add a comment..." id="comment-${post.id}" onkeydown="if(event.key==='Enter')App.addComment(${post.id})"/>
          <button onclick="App.addComment(${post.id})">Post</button>
        </div>
      </div>`;
    }).join('');
  },

  renderSidebar() {
    const sb = document.getElementById('sidebar');
    const suggestions = users.filter(u => u.id !== currentUser.id).slice(0, 5);
    sb.innerHTML = `
      <div class="sb-profile">
        <img class="sb-avatar" src="${currentUser.avatar}" onclick="App.showSection('profile')"/>
        <div>
          <div class="sb-uname" onclick="App.showSection('profile')">${currentUser.username}</div>
          <div class="sb-name">${currentUser.name}</div>
        </div>
        <span class="sb-switch">Switch</span>
      </div>
      <div class="sb-sugg-head"><span>Suggestions For You</span><a href="#">See All</a></div>
      ${suggestions.map(u => `
        <div class="sugg-item">
          <img class="sugg-avatar" src="${u.avatar}" alt="${u.username}"/>
          <div class="sugg-info">
            <div class="sugg-uname">${u.username}</div>
            <div class="sugg-sub">Suggested for you</div>
          </div>
          <button class="follow-btn" id="sb-follow-${u.id}" onclick="App.toggleFollow(${u.id},'sb-follow-${u.id}')">Follow</button>
        </div>`).join('')}`;
  },

  renderExplore() {
    const grid = document.getElementById('exploreGrid');
    grid.innerHTML = posts.map((post, i) => `
      <div class="exp-item" onclick="App.openPost(${post.id})" style="${i===0?'grid-column:span 2;grid-row:span 2':''}">
        <img src="${post.image}" alt="explore"/>
        <div class="exp-overlay">
          <span><i class="fas fa-heart"></i> ${post.likes}</span>
          <span><i class="fas fa-comment"></i> ${post.comments.length}</span>
        </div>
      </div>`).join('');
  },

  renderNotifications() {
    const list = document.getElementById('notifList');
    const notifs = [
      { userId:2, text:'liked your photo.', time:'2m', type:'like' },
      { userId:3, text:'started following you.', time:'15m', type:'follow' },
      { userId:4, text:'commented: Amazing shot!', time:'1h', type:'comment' },
      { userId:5, text:'liked your photo.', time:'3h', type:'like' },
      { userId:1, text:'mentioned you in a comment.', time:'5h', type:'mention' }
    ];
    list.innerHTML = notifs.map(n => {
      const u = users.find(x => x.id === n.userId);
      return `
        <div class="notif-item">
          <img src="${u.avatar}" alt="${u.username}"/>
          <div class="notif-text"><strong>${u.username}</strong> ${n.text}</div>
          <span class="notif-time">${n.time}</span>
          ${n.type === 'follow' ? '<button class="notif-follow-btn" onclick="App.toggleFollow(' + u.id + ',this)">Follow</button>' : '<img src="' + posts[0].image + '" style="width:44px;height:44px;object-fit:cover"/>'}
        </div>`;
    }).join('');
  },

  renderMessages() {
    const threads = document.getElementById('msgThreads');
    threads.innerHTML = users.filter(u => u.id !== currentUser.id).map(u => `
      <div class="msg-thread" onclick="App.startChat(${u.id})">
        <img src="${u.avatar}" alt="${u.username}"/>
        <div class="thread-info">
          <div class="thread-uname">${u.username}</div>
          <div class="thread-preview">${messages[u.id] && messages[u.id].length ? messages[u.id][messages[u.id].length-1].text : 'Start a conversation'}</div>
        </div>
      </div>`).join('');
  },

  startChat(userId) {
    activeChatId = userId;
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (!messages[userId]) messages[userId] = [];
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
      <div class="chat-head">
        <img src="${user.avatar}" alt="${user.username}"/>
        <span>${user.username}</span>
      </div>
      <div class="chat-msgs" id="chatMsgs">
        ${messages[userId].map(m => '<div class="chat-msg ' + (m.from === currentUser.id ? 'sent' : 'recv') + '">' + m.text + '</div>').join('')}
      </div>
      <div class="chat-inp-row">
        <input class="chat-inp" id="chatInp" placeholder="Message..." onkeydown="if(event.key==='Enter')App.sendMsg()"/>
        <button class="chat-send" onclick="App.sendMsg()">Send</button>
      </div>`;
    document.getElementById('chatMsgs').scrollTop = 9999;
  },

  sendMsg() {
    const inp = document.getElementById('chatInp');
    const text = inp.value.trim();
    if (!text || activeChatId === null) return;
    if (!messages[activeChatId]) messages[activeChatId] = [];
    messages[activeChatId].push({ from: currentUser.id, text });
    inp.value = '';
    const msgs = document.getElementById('chatMsgs');
    const div = document.createElement('div');
    div.className = 'chat-msg sent';
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = 9999;
    setTimeout(() => {
      const replies = ['Nice!', 'Haha!', 'Sure!', 'Okay!', 'Tell me more...', 'Great!', 'Love it!'];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      messages[activeChatId].push({ from: activeChatId, text: reply });
      const rdiv = document.createElement('div');
      rdiv.className = 'chat-msg recv';
      rdiv.textContent = reply;
      msgs.appendChild(rdiv);
      msgs.scrollTop = 9999;
    }, 1000);
  },

  renderProfile(userId) {
    const user = userId ? users.find(u => u.id === userId) : currentUser;
    if (!user) return;
    const userPosts = posts.filter(p => p.userId === user.id);
    const isOwn = user.id === currentUser.id;
    document.getElementById('profileWrap').innerHTML = `
      <div class="profile-wrap">
        <div class="profile-head">
          <img class="profile-pic" src="${user.avatar}" alt="${user.username}"/>
          <div class="profile-info">
            <div class="profile-uname-row">
              <span class="profile-uname">${user.username}</span>
              ${isOwn ? '<button class="profile-edit-btn">Edit Profile</button>' : '<button class="profile-edit-btn" style="background:#0095f6;color:#fff;border:none" onclick="App.toggleFollow(' + user.id + ',this)">Follow</button>'}
            </div>
            <div class="profile-stats">
              <div class="profile-stat"><strong>${userPosts.length}</strong><span>posts</span></div>
              <div class="profile-stat"><strong>${user.followers.toLocaleString()}</strong><span>followers</span></div>
              <div class="profile-stat"><strong>${user.following.toLocaleString()}</strong><span>following</span></div>
            </div>
            <div class="profile-bio">
              <strong>${user.name}</strong>
              <p>${user.bio || 'No bio yet.'}</p>
            </div>
          </div>
        </div>
        <div class="profile-tabs">
          <div class="profile-tab active">POSTS</div>
          <div class="profile-tab">SAVED</div>
          <div class="profile-tab">TAGGED</div>
        </div>
        <div class="profile-grid">
          ${userPosts.length ? userPosts.map(p => `
            <div class="profile-grid-item" onclick="App.openPost(${p.id})">
              <img src="${p.image}" alt="post"/>
              <div class="profile-grid-overlay">
                <span><i class="fas fa-heart"></i> ${p.likes}</span>
                <span><i class="fas fa-comment"></i> ${p.comments.length}</span>
              </div>
            </div>`).join('') : '<p style="padding:40px;color:#8e8e8e;grid-column:span 3;text-align:center">No posts yet.</p>'}
        </div>
      </div>`;
  },

  viewUser(userId) {
    App.showSection('profile');
    App.renderProfile(userId);
  },

  toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    App.renderFeed();
  },

  toggleSave(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    post.saved = !post.saved;
    App.toast(post.saved ? 'Post saved!' : 'Post unsaved!');
    App.renderFeed();
  },

  addComment(postId) {
    const inp = document.getElementById('comment-' + postId);
    const text = inp.value.trim();
    if (!text) return;
    const post = posts.find(p => p.id === postId);
    post.comments.push({ userId: currentUser.id, text });
    inp.value = '';
    App.toast('Comment added!');
    App.renderFeed();
  },

  toggleFollow(userId, btnOrId) {
    const btn = typeof btnOrId === 'string' ? document.getElementById(btnOrId) : btnOrId;
    if (!btn) return;
    const isFollowing = btn.textContent.trim() === 'Following';
    btn.textContent = isFollowing ? 'Follow' : 'Following';
    App.toast(isFollowing ? 'Unfollowed!' : 'Following!');
  },

  openPost(postId) {
    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === post.userId);
    document.getElementById('postModalContent').innerHTML = `
      <img class="post-modal-img" src="${post.image}" alt="post"/>
      <div class="post-modal-right">
        <div class="post-modal-head">
          <img src="${user.avatar}" alt="${user.username}"/>
          <strong>${user.username}</strong>
        </div>
        <div class="post-modal-comments">
          <div class="post-modal-comment">
            <img src="${user.avatar}" alt="${user.username}"/>
            <div><strong>${user.username}</strong> ${post.caption}</div>
          </div>
          ${post.comments.map(c => {
            const cu = users.find(u => u.id === c.userId) || currentUser;
            return '<div class="post-modal-comment"><img src="' + cu.avatar + '" alt="' + cu.username + '"/><div><strong>' + cu.username + '</strong> ' + c.text + '</div></div>';
          }).join('')}
        </div>
        <div class="post-modal-actions">
          <button class="act-btn ${post.liked ? 'liked' : ''}" onclick="App.toggleLike(${post.id});App.openPost(${post.id})">
            <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <strong style="font-size:14px;margin-left:4px">${post.likes} likes</strong>
        </div>
        <div class="post-modal-inp">
          <input type="text" placeholder="Add a comment..." id="modal-comment-${post.id}" onkeydown="if(event.key==='Enter')App.addModalComment(${post.id})"/>
          <button onclick="App.addModalComment(${post.id})">Post</button>
        </div>
      </div>`;
    App.openModal('postModal');
  },

  addModalComment(postId) {
    const inp = document.getElementById('modal-comment-' + postId);
    const text = inp.value.trim();
    if (!text) return;
    const post = posts.find(p => p.id === postId);
    post.comments.push({ userId: currentUser.id, text });
    inp.value = '';
    App.openPost(postId);
  },

  openCreate() { App.openModal('createModal'); },

  previewImg(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('uploadArea').classList.add('hidden');
      document.getElementById('previewArea').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  },

  createPost() {
    const caption = document.getElementById('captionInp').value.trim();
    const imgSrc = document.getElementById('previewImg').src;
    if (!imgSrc || imgSrc === window.location.href) { App.toast('Please select an image!'); return; }
    const newPost = { id: posts.length+1, userId: currentUser.id, image: imgSrc, caption: caption || '', likes: 0, liked: false, saved: false, time: 'Just now', comments: [] };
    posts.unshift(newPost);
    currentUser.posts++;
    App.closeModal('createModal');
    App.renderFeed();
    App.renderProfile();
    App.toast('Post shared!');
    document.getElementById('uploadArea').classList.remove('hidden');
    document.getElementById('previewArea').classList.add('hidden');
    document.getElementById('captionInp').value = '';
  },

  search(query) {
    const drop = document.getElementById('searchDrop');
    if (!query.trim()) { drop.classList.add('hidden'); return; }
    const results = users.filter(u => u.username.includes(query.toLowerCase()) || u.name.toLowerCase().includes(query.toLowerCase()));
    if (!results.length) { drop.classList.add('hidden'); return; }
    drop.classList.remove('hidden');
    drop.innerHTML = results.map(u => `
      <div class="search-item" onclick="App.viewUser(${u.id});document.getElementById('searchDrop').classList.add('hidden');document.getElementById('searchInp').value=''">
        <img src="${u.avatar}" alt="${u.username}"/>
        <div>
          <div style="font-weight:600;font-size:14px">${u.username}</div>
          <div style="font-size:12px;color:#8e8e8e">${u.name}</div>
        </div>
      </div>`).join('');
  },

  openModal(id) { document.getElementById(id).classList.remove('hidden'); },
  closeModal(id) { document.getElementById(id).classList.add('hidden'); },

  toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
};

window.onload = () => {
  currentUser = users[0];
  App.initApp();
  App.showPage('mainApp');
};
