/**
 * 读取应用配置文件
 * Read application configuration file
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析配置文件
 * @param {string} configPath - 配置文件路径
 * @returns {object} 配置对象
 */
function parseConfig(configPath) {
  const content = fs.readFileSync(configPath, 'utf-8');
  const config = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    
    // 跳过注释和空行
    if (line.startsWith('#') || line === '') {
      return;
    }
    
    // 解析 key=value
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      config[key.trim()] = value;
    }
  });
  
  return config;
}

/**
 * 读取当前要构建的app名称
 * @returns {string} app名称
 */
function getCurrentAppName() {
  const buildAppPath = path.join(__dirname, '../assets/build.app');
  
  if (!fs.existsSync(buildAppPath)) {
    throw new Error('未找到 assets/build.app 文件！');
  }
  
  const appName = fs.readFileSync(buildAppPath, 'utf-8').trim();
  
  if (!appName) {
    throw new Error('assets/build.app 文件内容为空！');
  }
  
  return appName;
}

/**
 * 读取指定app的配置
 * @param {string} appName - app名称
 * @returns {object} 配置对象
 */
function getAppConfig(appName) {
  const configPath = path.join(__dirname, `../assets/${appName}/app.cfg`);
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`未找到配置文件: assets/${appName}/app.cfg`);
  }
  
  const config = parseConfig(configPath);
  
  // 添加资源路径
  config.assetsPath = path.join(__dirname, `../assets/${appName}`);
  config.appFolderName = appName;
  
  return config;
}

/**
 * 获取当前构建配置
 * @returns {object} 配置对象
 */
function getCurrentConfig() {
  const appName = getCurrentAppName();
  console.log(`📱 当前构建应用: ${appName}`);
  
  const config = getAppConfig(appName);
  console.log(`✅ 配置加载成功: ${config.appName || appName}`);
  
  return config;
}

/**
 * 类型转换
 */
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value) && value !== '') return Number(value);
  return value;
}

/**
 * 获取配置值（支持类型转换）
 */
function getConfigValue(config, key, defaultValue) {
  const value = config[key];
  if (value === undefined) return defaultValue;
  return parseValue(value);
}

module.exports = {
  parseConfig,
  getCurrentAppName,
  getAppConfig,
  getCurrentConfig,
  getConfigValue,
};

// 如果直接运行此脚本，输出当前配置
if (require.main === module) {
  try {
    const config = getCurrentConfig();
    console.log('\n📋 当前配置:');
    console.log(JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}
