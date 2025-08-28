package service

import (
	"admingo/internal/modules/menu/model"
	rbacmodel "admingo/internal/modules/rbac/model"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

type MockRBACService struct {
	permissions []string
	err         error
}

func (m *MockRBACService) AssignPermissionToRole(roleName string, permissionCode string) error {
	panic("unimplemented")
}

func (m *MockRBACService) CreatePermission(code string, path string) (*rbacmodel.Permission, error) {
	panic("unimplemented")
}

func (m *MockRBACService) DeletePermission(code string) error {
	panic("unimplemented")
}

func (m *MockRBACService) UpdatePermission(code string, newPerm *rbacmodel.Permission) error {
	panic("unimplemented")
}

func (m *MockRBACService) CreateUser(username, password string) (*rbacmodel.User, error) {
	return nil, nil
}
func (m *MockRBACService) VerifyUser(username, password string) (*rbacmodel.User, error) {
	return nil, nil
}
func (m *MockRBACService) GetUserRoles(userID uint) ([]rbacmodel.Role, error) {
	return nil, nil
}
func (m *MockRBACService) GetRolePermissions(roleID uint) ([]rbacmodel.Permission, error) {
	return nil, nil
}
func (m *MockRBACService) GetUserPermissions(userID uint) ([]string, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.permissions, nil
}
func (m *MockRBACService) HasPermission(userPermissions []string, permissionCode string) bool {
	return false
}

type MockMenuRepository struct {
	menus []model.Menu
	err   error
}

func (m *MockMenuRepository) GetDB() *gorm.DB {
	return nil
}
func (m *MockMenuRepository) Create(entity *model.Menu) error {
	return nil
}
func (m *MockMenuRepository) GetByID(id uint) (*model.Menu, error) {
	return nil, nil
}
func (m *MockMenuRepository) Update(entity *model.Menu) error {
	return nil
}
func (m *MockMenuRepository) Delete(id uint) error {
	return nil
}
func (m *MockMenuRepository) List(offset, limit int) ([]*model.Menu, error) {
	return nil, nil
}
func (m *MockMenuRepository) FindByPermissionCodes(permissionCodes []string) ([]model.Menu, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []model.Menu
	for _, menu := range m.menus {
		for _, code := range permissionCodes {
			if menu.PermissionCode == code {
				result = append(result, menu)
				break
			}
		}
	}
	return result, nil
}

func (m *MockMenuRepository) FindAllByIDs(ids []uint) ([]model.Menu, error) {
	if m.err != nil {
		return nil, m.err
	}
	var result []model.Menu
	for _, menu := range m.menus {
		for _, id := range ids {
			if menu.ID == id {
				result = append(result, menu)
				break
			}
		}
	}
	return result, nil
}

// --- Tests ---

func TestMenuService_FindByUserID(t *testing.T) {
	rootID := uint(1)
	sysID := uint(2)
	userID := uint(3)
	roleID := uint(4)

	allMenus := []model.Menu{
		{Model: gorm.Model{ID: rootID}, Title: "Dashboard", PermissionCode: "dashboard:view"},
		{Model: gorm.Model{ID: sysID}, Title: "System", PermissionCode: "sys:view", ParentID: &rootID},
		{Model: gorm.Model{ID: userID}, Title: "User Management", PermissionCode: "sys:user:view", ParentID: &sysID},
		{Model: gorm.Model{ID: roleID}, Title: "Role Management", PermissionCode: "sys:role:view", ParentID: &sysID},
		{Model: gorm.Model{ID: 5}, Title: "Edit Role", PermissionCode: "sys:role:edit", ParentID: &roleID},
	}

	tests := []struct {
		name               string
		userID             uint
		mockPermissions    []string
		mockPermissionsErr error
		mockRepoErr        error
		wantMenus          []model.Menu
		wantErr            bool
	}{
		{
			name:            "Success - User has some permissions",
			userID:          1,
			mockPermissions: []string{"dashboard:view", "sys:user:view"},
			wantMenus: []model.Menu{
				allMenus[0], // dashboard:view
				allMenus[2], // sys:user:view
				allMenus[1], // parent of sys:user:view
			},
			wantErr: false,
		},
		{
			name:            "Success - User has no permissions",
			userID:          2,
			mockPermissions: []string{},
			wantMenus:       []model.Menu{}, // 用空 slice 表示无权限
			wantErr:         false,
		},
		{
			name:               "Error - RBAC service returns an error",
			userID:             3,
			mockPermissionsErr: errors.New("rbac service unavailable"),
			wantMenus:          nil,
			wantErr:            true,
		},
		{
			name:            "Error - Repository returns an error",
			userID:          4,
			mockPermissions: []string{"dashboard:view"},
			mockRepoErr:     errors.New("database connection failed"),
			wantMenus:       nil,
			wantErr:         true,
		},
		{
			name:            "Success - With parent lookup",
			userID:          5,
			mockPermissions: []string{"sys:role:edit"},
			wantMenus: []model.Menu{
				allMenus[4], // sys:role:edit
				allMenus[3], // sys:role:view
				allMenus[1], // sys:view
				allMenus[0], // dashboard:view
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRBAC := &MockRBACService{
				permissions: tt.mockPermissions,
				err:         tt.mockPermissionsErr,
			}
			mockRepo := &MockMenuRepository{
				menus: allMenus,
				err:   tt.mockRepoErr,
			}
			s := New(mockRepo, mockRBAC)
			gotMenus, err := s.FindByUserID(tt.userID)

			if tt.wantErr {
				require.Error(t, err)
				require.Nil(t, gotMenus)
			} else {
				require.NoError(t, err)
				require.ElementsMatch(t, tt.wantMenus, gotMenus)
			}
		})
	}
}
