package config

import (
	"log"

	"github.com/spf13/viper"
)

var Conf *Config

type Server struct {
	Port int    `mapstructure:"port"`
	Host string `mapstructure:"host"`
}

type I18n struct {
	LocalsPath string `mapstructure:"localsPath"`
}

type Database struct {
	Driver    string `yaml:"driver"`    // mysql
	Name      string `yaml:"name"`      // admingo
	Charset   string `yaml:"charset"`   // utf8mb4
	ParseTime bool   `yaml:"parseTime"` // true
	Loc       string `yaml:"loc"`       // Local
}

type JWT struct {
	Secret string `mapstructure:"secret"`
}

type Config struct {
	Server   Server   `mapstructure:"server"`
	I18n     I18n     `mapstructure:"i18n"`
	Database Database `mapstructure:"database"`
	JWT      JWT      `mapstructure:"jwt"`
}

func init() {
	viper.AutomaticEnv()
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Failed to read config.yaml: %v", err)
	}

	if err := viper.Unmarshal(&Conf); err != nil {
		log.Fatalf("Failed to unmarshal config: %v", err)
	}
}
