package utils

import (
	"reflect"
)

func MergeNonZero[T any](oldStruct, newStruct *T) {
	oldVal := reflect.ValueOf(oldStruct).Elem()
	newVal := reflect.ValueOf(newStruct).Elem()
	typ := oldVal.Type()

	for i := 0; i < typ.NumField(); i++ {
		oldField := oldVal.Field(i)
		newField := newVal.Field(i)

		if !oldField.CanSet() {
			continue
		}

		zero := reflect.Zero(newField.Type()).Interface()
		if !reflect.DeepEqual(newField.Interface(), zero) {
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
