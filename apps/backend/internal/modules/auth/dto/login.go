package dto

type LoginDTO struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponseDTO struct {
	Username string `json:"username"`
	UserId   uint   `json:"userId"`
	Token    string `json:"token"`
}
