/**
 * Created by vlad on 01.06.17.
 */
const moment = require('moment');
const TgFancy = require('tgfancy');

const TELEGRAM_TOKEN = process.env.WATCHMEN_TELEGRAM_TOKEN || null;
const ENABLE_LATENCY_WARNING = process.env.WATCHMEN_TELEGRAM_LATENCY_WARNING || true;

const bot = new TgFancy(TELEGRAM_TOKEN);

const getChatIds = function(service) {
    return (service.alertToTelegram || "").split(',');
}

const eventHandlers = {
    /**
     * On a new outage
     * @param {Object} service
     * @param {Object} outage
     * @param {Object} outage.error check error
     * @param {number} outage.timestamp outage timestamp
     */
    onNewOutage: function (service, outage) {
        var errorMsg = service.name + ' down!. Error: ' + JSON.stringify(outage.error);
        _telegramSend(getChatIds(service), errorMsg);
    },

    /**
     * Failed ping on an existing outage
     * @param {Object} service
     * @param {Object} outage
     * @param {Object} outage.error check error
     * @param {number} outage.timestamp outage timestamp
     */
    onCurrentOutage: function (service, outage) {
        var errorMsg = service.name + ' is still down!. Error: ' + JSON.stringify(outage.error);
        _telegramSend(getChatIds(service), errorMsg);
    },

    /**
     * Failed check (it will be an outage or not according to service.failuresToBeOutage
     * @param {Object} service
     * @param {Object} data
     * @param {Object} data.error check error
     * @param {number} data.currentFailureCount number of consecutive check failures
     */
    onFailedCheck: function (service, data) {
        var errorMsg = service.name + ' check failed!. Error: ' + JSON.stringify(data.error);
        _telegramSend(getChatIds(service), errorMsg);
    },

    /**
     * Warning alert
     * @param {Object} service
     * @param {Object} data
     * @param {number} data.elapsedTime (ms)
     */
    onLatencyWarning: function (service, data) {
        var msg = service.name + ' latency warning. Took: ' + (data.elapsedTime + ' ms.');
        _telegramSend(getChatIds(service), msg);
    },

    /**
     * Service is back online
     * @param {Object} service
     * @param {Object} lastOutage
     * @param {Object} lastOutage.error
     * @param {number} lastOutage.timestamp (ms)
     */
    onServiceBack: function (service, lastOutage) {
        var duration = moment.duration(moment().unix() - lastOutage.timestamp, 'seconds');
        var msg = service.name + ' is back. Down for ' + duration.humanize();
        _telegramSend(getChatIds(service), msg);
    }
};
/**
 * Send message using Telegram
 * @param {array} chartIds
 * @param {string} msg Message to send
 * @private
 */
function _telegramSend(chatIds, msg) {
    if (!TELEGRAM_TOKEN) return console.log("Please set the environment variable WATCHMEN_TELEGRAM_TOKEN");

    chatIds.forEach(function(chatId){
        chatId = chatId.trim();
        bot.sendMessage(chatId, msg);
    });
}

function TelegramPlugin(watchmen) {
    watchmen.on('new-outage', eventHandlers.onNewOutage);
    watchmen.on('current-outage', eventHandlers.onCurrentOutage);
    watchmen.on('service-error', eventHandlers.onFailedCheck);

    if (ENABLE_LATENCY_WARNING)
        watchmen.on('latency-warning', eventHandlers.onLatencyWarning);
    watchmen.on('service-back', eventHandlers.onServiceBack);
}

exports = module.exports = TelegramPlugin;