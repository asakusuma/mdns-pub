var avahi = require('./node_avahi_pub/avahi_pub');
var mdns = require('mdns');
var _ = require('lodash');

//{ name: 'raop', protocol: 'tcp', subtypes: [] }
//_raop._tcp

function castStringType(type) {
  if (_.isObject(type) && type.name && type.protocol) {
    return '_' + type.name + '._' + type.protocol;
  } else if (_.isString(type)) {
    return type;
  } else {
    throw 'Invalid type given';
  }
}

function castObjectType(type) {
  if (_.isString(type)) {
    if (type[0]) {
      type = type.substring(1);
    }
    var segs = type.split(/[_\.]+/);
    if (segs.length < 2) {
      throw 'Invalid type given';
    } else {
      return { name: segs[0], protocol: segs[1], subtypes: [] }
    }
  } else if (_.isObject(type)) {
    return type;
  } else {
    throw 'Invalid type given';
  }
}

module.exports = {
  publish: function(options) {
    if (avahi.isSupported()) {
      options.type = castStringType(options.type);
      return avahi.publish(options);
    } else {
      return mdns.createAdvertisement(castObjectType(options.type), options.port, {
        name: options.name,
        txtRecord: options.data
      });
    }
  }
}