package main

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/cdreier/golang-snippets/snippets"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/markbates/pkger"
)

type socket struct {
	rooms map[string][]*websocket.Conn
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type socketMsg struct {
	Type string `json:"type,omitempty"`
	Data string `json:"data,omitempty"`
}

func (s *socket) handler(w http.ResponseWriter, r *http.Request) {
	connection, err := upgrader.Upgrade(w, r, nil)

	room := r.URL.Query().Get("room")
	if room == "" {
		http.Error(w, "no valid room", http.StatusBadRequest)
		return
	}

	s.rooms[room] = append(s.rooms[room], connection)

	if err != nil {
		log.Print("could not start websocket:", err)
		return
	}
	defer connection.Close()

	for {
		_, message, err := connection.ReadMessage()
		if err != nil {
			// log.Println("err: ", userID, message, mt, err)
			if websocket.IsCloseError(err, websocket.CloseGoingAway) {
				for i, c := range s.rooms[room] {
					if c == connection {
						s.rooms[room][i] = s.rooms[room][len(s.rooms[room])-1]
						s.rooms[room][len(s.rooms[room])-1] = nil
						s.rooms[room] = s.rooms[room][:len(s.rooms[room])-1]
					}
				}
				if len(s.rooms[room]) == 0 {
					delete(s.rooms, "room")
				}
			}
			break
		}

		var msg socketMsg
		json.Unmarshal(message, &msg)

		switch msg.Type {
		case "change":
			for _, c := range s.rooms[room] {
				if c != connection {
					c.WriteJSON(msg)
				}
			}
			break
		}

	}
}

func index(w http.ResponseWriter, r *http.Request) {

	f, _ := pkger.Open("/www/index.html")
	defer f.Close()
	indexString, _ := ioutil.ReadAll(f)

	tmpl, err := template.New("index").Parse(string(indexString))
	if err != nil {
		log.Panic(err)
	}
	tmpl.Execute(w, nil)
}

func main() {

	r := chi.NewRouter()

	assestDir := pkger.Dir("/assets")
	snippets.ChiFileServer(r, "/assets", assestDir)

	s := new(socket)
	s.rooms = make(map[string][]*websocket.Conn)
	r.Get("/", index)

	r.Get("/ws", s.handler)

	log.Println("started on port 8080 ")
	http.ListenAndServe(":8080", r)
}
