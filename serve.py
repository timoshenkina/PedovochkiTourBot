import http.server, os
os.chdir("/Users/darinatimosenko/Desktop/project_telegramm_bot")
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=8080, bind="127.0.0.1")
