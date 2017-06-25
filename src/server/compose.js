const fs = require('fs');

function compose(jurisdiction, topic1, callback) {
  loadConfigurations(jurisdiction, topic1, (err1, config) => {
    if (err1) callback(err1);
    else {
      loadTopic(jurisdiction, topic1, config, (err2, topic2) => {
        if (err2) callback(err2);
        else callback(topic2);
      });
    }
  });
}

function mainCompose(callback) {
  const file = './content/pages/main/config.json'; // main configuration
  const main = {
    config: {},
    common: {}
  };
  //loadConfig(file, {}, (lcErr, config) => {
  fs.open(file, 'r', (err, fd) => {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (rfErr, data) => {
        if (rfErr) callback(rfErr, null);
        else {
          const configMain = JSON.parse(data);
          main.config = configMain
          callback(null, main);

          //callback(null, Object.assign({}, inputConfig, config));
        }
      });
    }
  });

  //});
}

// Load and merge all the configurations
function loadConfigurations(jurisdiction, topic, callback) {
  const file1 = './content/config.json'; // site configuration
  loadConfig(file1, {}, (lc1Err, config1) => {
    if (lc1Err) callback(lc1Err, null);
    else {
      const file2 = `./content/pages/${topic}/config.json`; // site topic configuration
      loadConfig(file2, config1, (lc2Err, config2) => {
        if (lc2Err) callback(lc2Err, null);
        else {
          const file3 = `./content/jurisdictions/${jurisdiction}/config.json`; // local configuration
          loadConfig(file3, config2, (lc3Err, config3) => {
            if (lc3Err) callback(lc3Err, null);
            else {
              const file4 = `./content/jurisdictions/${jurisdiction}/${topic}/config.json`; // local topic configuration
              loadConfig(file4, config3, (lc4Err, config4) => {
                if (lc4Err) callback(lc4Err, null);
                else callback(null, config4);
              });
            }
          });
        }
      });
    }
  });
}

function loadConfig(path, inputConfig, callback) {
  fs.open(path, 'r', (err, fd) => {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (rfErr, data) => {
        if (rfErr) callback(rfErr, null);
        else {
          const config = JSON.parse(data);
          callback(null, Object.assign({}, inputConfig, config));
        }
      });
    }
  });
}

function loadTopic(jurisdiction, topicName, config, callback) {
  const topic = {
    config,
    common: {},
    jurisdiction: {},
  };
  loadCommonTopic(topicName, topic, (err1, commonTopic) => {
    if (err1) callback(err1, null);
    else {
      topic.common = commonTopic;
      loadJurisdictionTopic(jurisdiction, topicName, topic, (err2, jurisdictionTopic) => {
        if (err2) callback(err2, null);
        else {
          topic.jurisdiction = jurisdictionTopic;
          callback(null, topic);
        }
      });
    }
  });
}

function loadCommonTopic(topicName, config, callback) {
  const topic = {};
  const file1 = `./content/pages/${topicName}/description.html`;
  loadTextFile(file1, (err1, description) => {
    if (err1) callback(err1, null);
    else {
      topic.description = description;
      const file2 = `./content/pages/${topicName}/resources_common.json`;
      loadJsonFile(file2, (err2, common) => {
        if (err2) callback(err2, null);
        else {
          topic.common = common;
          const file3 = `./content/pages/${topicName}/resources_local.json`;
          loadJsonFile(file3, (err3, local) => {
            if (err3) callback(err3, null);
            else {
              topic.local = local;
              callback(null, topic);
            }
          });
        }
      });
    }
  });
}

function loadJurisdictionTopic(jurisdiction, topicName, config, callback) {
  const topic = {};
  const file1 = `./content/jurisdictions/${jurisdiction}/${topicName}/description.html`;
  loadTextFile(file1, (err1, description) => {
    if (err1) callback(err1, null);
    else {
      topic.description = description;
      const file2 = `./content/jurisdictions/${jurisdiction}/${topicName}/resources_local.json`;
      loadJsonFile(file2, (err2, local) => {
        if (err2) callback(err2, null);
        else {
          topic.local = local;
          callback(null, topic);
        }
      });
    }
  });
}

function loadTextFile(path, callback) {
  fs.open(path, 'r', (err, fd) => {
    if (err) callback(err, null);
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (rfErr, data) => {
        if (rfErr) callback(rfErr, null);
        else {
          callback(null, data);
        }
      });
    }
  });
}

function loadJsonFile(path, callback) {
  fs.open(path, 'r', (err, fd) => {
    if (err) callback(err, null);
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (rfErr, data) => {
        if (rfErr) callback(rfErr, null);
        else {
          const content = JSON.parse(data);
          callback(null, content);
        }
      });
    }
  });
}

module.exports = {compose, mainCompose};
