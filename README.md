# watchmen-plugin-telegram [![Dependency Status](https://gemnasium.com/badges/github.com/vlaad360/watchmen-plugin-telegram.svg)](https://gemnasium.com/github.com/vlaad360/watchmen-plugin-telegram)

Plugin that allow [watchmen](https://github.com/iloire/watchmen) to send messages through [Telegram Bot](https://core.telegram.org/bots).

**WATCHMEN_TELEGRAM_TOKEN** is the bot token \
**WATCHMEN_TELEGRAM_LATENCY_WARNING** enable\disable latency warning by default is true

Edit file `webserver/views/service-edit.html` and append after line 99 the following:
```
<div class="form-group">
    <label for="service-alertToTelegram" class="col-sm-2 control-label">Alert to telegram</label>
    <div class="col-sm-6">
        <input type="text" ng-model="service.alertToTelegram" type="checkbox" class="form-control" id="service-alertToTelegram"
            placeholder="111111,222222">
    </div>
    <div class="descr col-sm-4">List of telegram accounts to alert to</div>
</div>
```

## Dependencies
- moment 2.18.1
- tgfancy 0.13.0
