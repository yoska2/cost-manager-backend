import requests
import sys

filename = input("filename=")

# The first will handle the logs. (a)
# The second will handle all user-related tasks. (b)
# The third will handle all cost-related tasks. (c)
# The fourth will handle any admin-related tasks. (d)

a = "https://cost-manager-logs-vl8y.onrender.com"
b = "https://cost-manager-users-xof7.onrender.com"
c = "https://cost-manager-costs-birh.onrender.com"
d = "https://cost-manager-admin-6mct.onrender.com"

output = open(filename, "w")
sys.stdout = output

print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + d)
print()


print("testing getting the about")
print("-------------------------")

try:
    text = ""

    # Getting details of team manager
    url = d + "/api/about/"

    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(data.json())

except Exception as e:
    print("problem")
    print(e)

print("")


print()
print("testing getting the report - 1")
print("------------------------------")

try:
    text = ""

    # Getting the report
    url = c + "/api/report/?id=123123&year=2026&month=1"

    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)

except Exception as e:
    print("problem")
    print(e)

print("")


print()
print("testing adding cost item")
print("----------------------------------")

try:
    text = ""

    url = c + "/api/add/"

    data = requests.post(
        url,
        json={
            "userid": 123123,
            "description": "milk 9",
            "category": "food",
            "sum": 8
        }
    )

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")


print()
print("testing getting the report - 2")
print("------------------------------")

try:
    text = ""

    # Getting the report
    url = c + "/api/report/?id=123123&year=2026&month=5"

    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)

except Exception as e:
    print("problem")
    print(e)

print("")

output.close()