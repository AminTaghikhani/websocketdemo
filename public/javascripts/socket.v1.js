const socketConfiguration = {
  socket: null,
  setup() {
    const context = this;
    context.initialConnection();
  },
  initialConnection() {
    const context = this;
    context.socket = io();
    context.events();
  },
  events() {
    const context = this
    context.socket.on('join', (data) => context.newUser(data))
    context.socket.on('leave', (data) => context.leaveUser(data))
    context.socket.on('receive', (data) => context.receiveMessage(data))
  },
  newUser(data) {
    const context = this;
    const card = `<div class="user-item col-lg-4 col-md-4 col-sm-6 col-xs-12 float-r" data-id=${data.id}>
    <div class="card">
        <div class="header bg-cyan">
            <h2>
                دستگاه: <small>${data.id}</small>
            </h2>
            <ul class="header-dropdown m-r-0">
                                <li>
                                    <a href="javascript:void(0);" class="btn-remove-user" data-id=${data.id}>
                                        <i class="material-icons">delete</i>
                                    </a>
                                </li>
                            </ul>
        </div>
        <div class="body">
          <div class="row">
          <ul style="list-style-type: none; padding-right:0;" class="msg-list"></ul>
          </div>
          <div class="row"><div class="input-group">
          <div class="form-line">
              <input type="text" class="form-control txt-message" placeholder="Message">
          </div>
          </br>
          <button class="btn btn-success btn-send-message" data-id=${data.id}>ارسال</button>
      </div></div>
        </div>
    </div>
</div>`
    $('#card-container').append(card);
    context.removeButton()
    context.sendButton()
    context.removeAll()
  },
  leaveUser(data) {
    const users = Array.from($('.user-item'));
    users.forEach(user => {
      const check = $(user).data('id') === data.id
      if (check)
        $(user).remove()
    })
  },
  sendButton() {
    const context = this;
    const targets = Array.from($('.btn-send-message'));
    targets.forEach(target => {
      $(target).click(() => {
        const targetId = $(target).data('id');
        const input = $(target).closest("div.input-group").find("input.txt-message");
        context.socket.emit('send-admin', { targetId, message: input.val() })
        const ul = $(target).closest("div.body").find("ul.msg-list");
        ul.append(`<li class="bg-green"  style="padding: 5px;">${input.val()}</li>`)
        input.val('')
      })
    })
  },
  removeButton() {
    const context = this;
    const targets = Array.from($('.btn-remove-user'));
    targets.forEach(target => {
      $(target).click(() => {
        const id = $(target).data('id');
        context.socket.emit('kick', { id })
      })
    })
  },
  receiveMessage(data) {
    console.log(data)
    const users = Array.from($('.user-item'));
    users.forEach(user => {
      const check = $(user).data('id') === data.id
      if (check) {
        const ul = $(user).find("ul.msg-list");
        ul.append(`<li class="bg-blue" style="text-align: left; padding: 5px;">${data.message}</li>`)
      }
    })
  },
  removeAll() {
    
  }
}


socketConfiguration.setup()