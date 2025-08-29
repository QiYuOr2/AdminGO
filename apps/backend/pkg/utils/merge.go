package utils

import (
	"reflect"
)

func MergeNonZero[T any](oldStruct, newStruct *T, excludeKeys ...string) {
	oldVal := reflect.ValueOf(oldStruct).Elem()
	newVal := reflect.ValueOf(newStruct).Elem()
	typ := oldVal.Type()

	excludeMap := make(map[string]struct{}, len(excludeKeys))
	for _, key := range excludeKeys {
		excludeMap[key] = struct{}{}
	}

	for i := 0; i < typ.NumField(); i++ {
		oldField := oldVal.Field(i)
		newField := newVal.Field(i)

		if !oldField.CanSet() {
			continue
		}

		_, excluded := excludeMap[typ.Field(i).Name]
		zero := reflect.Zero(newField.Type()).Interface()
		if excluded || !reflect.DeepEqual(newField.Interface(), zero) {
			oldField.Set(newField)
		}
	}
}

func MergeNonNil[T any](oldStruct, newStruct *T) {
	oldVal := reflect.ValueOf(oldStruct).Elem()
	newVal := reflect.ValueOf(newStruct).Elem()
	typ := oldVal.Type()

	for i := 0; i < typ.NumField(); i++ {
		oldField := oldVal.Field(i)
		newField := newVal.Field(i)

		if !oldField.CanSet() {
			continue
		}

		if newField.Kind() == reflect.Ptr && !newField.IsNil() {
			oldField.Set(newField.Elem())
		}
	}
}
