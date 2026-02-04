package app

import (
	"go_project/internal/middleware"
	"go_project/internal/utils"
	"net/http"
)

func (a *Application) Me(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)
	utils.WriteJSON(w, http.StatusOK, utils.Envelope{"user": user})
}
