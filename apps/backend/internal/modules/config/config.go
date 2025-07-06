package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

var Conf *Config

type Server struct {
	Port int `mapstructure:"port"`
}

type I18n struct {
	LocalsPath string `mapstructure:"localsPath"`
}

type Database struct {
	Driver    string `yaml:"driver"`     // mysql
	Host      string `yaml:"host"`       // 127.0.0.1
	Port      int    `yaml:"port"`       // 3306
	User      string `yaml:"user"`       // root
	Password  string `yaml:"password"`   // root123
	Name      string `yaml:"name"`       // admingo
	Charset   string `yaml:"charset"`    // utf8mb4
	ParseTime bool   `yaml:"parse_time"` // true
	Loc       string `yaml:"loc"`        // Local
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
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, skipping...")
	}

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./") // 在当前目录查找

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Failed to read config.yaml: %v", err)
	}

	if err := viper.Unmarshal(&Conf); err != nil {
		log.Fatalf("Failed to unmarshal config: %v", err)
	}
}
