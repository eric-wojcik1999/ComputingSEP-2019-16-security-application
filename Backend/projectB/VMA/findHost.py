from VMA.models import Asset



# used by ZAP
def find_host_domain_name(domain, name, company):
    dom_set = Asset.objects.filter(domain=domain, company=company)
    name_set = Asset.objects.filter(name=name, company=company)
    if (name_set.count() == 1 and name_set.get().domain is None):
        name_set.update(domain=domain)
    asset_id = cross_check(dom_set, name_set)
    return asset_id


# finds the host based on IP and hostName
# Used by Nmap
def find_host_ip_name(ip, name, company):
    ip_set = Asset.objects.filter(host_address=ip, company=company)  # Query the ip and limit to our own company
    name_set = Asset.objects.filter(name=name, company=company)  # Query the name and limit to our own company
    if (name_set.count() == 1 and name_set.get().host_address is None):
        name_set.update(host_address=ip)
    asset_id = cross_check(ip_set, name_set)
    return asset_id


# finds the host based on IP and MAC address
# Used by Nessus, Nexpose
def find_host_ip_mac(ip, mac, company):
    ip_set = Asset.objects.filter(host_address=ip, company=company)  # Query the ip and limit to our own company
    mac_set = Asset.objects.filter(mac_address=mac, company=company)  # Query the name, limit to our own company
    if (ip_set.count() == 1 and ip_set.get().mac_address is None):
        ip_set.update(mac_address=mac)
    asset_id = cross_check(ip_set, mac_set)
    return asset_id


# IP set - first queryset based on IP
# Alt set - 2nd queryset based on either name or mac address
def cross_check(ip_set, alt_set):
    asset_id = -1  # Default if nothing comes back
    ip_count = ip_set.count()  # How many assets in the set
    alt_count = alt_set.count()  # How many assets in the set
    # This giant is statement is to check over the sets we get from our queries.
    if ip_count == 1 and alt_count == 1:  # Only one in each set
        ip_asset = ip_set.get()  # Get the one from the set
        alt_asset = alt_set.get()  # Get the one from the set
        if ip_asset.pk == alt_asset.pk:  # Check they are the SAME asset
            asset_id = ip_asset.pk  # assign it
        else:
            asset_id = alt_asset.pk  # Going to trust the alt vs the ip as IP more likely to change
    else:
        if ip_count == 1:
            temp = ip_set.get()  # Grab the asset
            pk = temp.pk  # Get the ID
            if alt_set.filter(id=pk).count() == 1:  # Check if that one asset is in the other set.
                asset_id = alt_set.get(id=pk).pk  # assign it to the match
            else:
                asset_id = pk  # if its not in the other set, assign it to our one.
        if alt_count == 1:
            temp = alt_set.get()  # Grab the asset
            pk = temp.pk  # Get the ID
            if ip_set.filter(id=pk).count() == 1:  # Check if that one asset is in the other set.
                asset_id = ip_set.get(id=pk).pk  # assign it to the match
            else:
                asset_id = pk  # if its not in the other set, assign it to our one.
        if alt_count > 1 and ip_count > 1:
            asset_id = -2
            # This should really never happen because now we have multiple assets sharing the same alt vars
            # and addresses which we cant resolve in the query
    return asset_id
