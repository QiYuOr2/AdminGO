package i18n

import (
	"admingo/internal/config"
	"fmt"
	"path/filepath"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
	"gopkg.in/yaml.v3"
)

var bundle *i18n.Bundle

type LocalizeConfig = i18n.LocalizeConfig

func init() {
	bundle = i18n.NewBundle(language.English)
	bundle.RegisterUnmarshalFunc("yml", yaml.Unmarshal)

	langs, err := filepath.Glob(filepath.Join(config.Conf.I18n.LocalsPath, "*.yml"))
	if err != nil {
		panic(fmt.Sprintf("failed to find language files: %v", err))
	}

	for _, langFile := range langs {
		_, err := bundle.LoadMessageFile(langFile)
		if err != nil {
			panic(fmt.Sprintf("failed to load message file %s: %v", langFile, err))
		}
	}
}

func GetLocalizer(lang string) *i18n.Localizer {
	return i18n.NewLocalizer(bundle, lang)
}
