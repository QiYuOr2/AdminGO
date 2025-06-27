package config

import (
	"fmt"
	"github.com/spf13/viper"
)

var Conf *Config

type Server struct {
	Port int `mapstructure:"port"`
}

type Config struct {
	Server Server `mapstructure:"server"`
}

func init() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./") // 在当前目录查找

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}

	if err := viper.Unmarshal(&Conf); err != nil {
		panic(fmt.Errorf("unmarshal config failed: %s", err))
	}
}
