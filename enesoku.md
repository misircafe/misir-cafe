categories read update delete rls izinleri:
create policy "Only admin can insert"
on categories
for insert
to authenticated
with check (auth.uid() = '6422cae9-41bf-40c6-a53b-b612b3cf6d35');

create policy "Only admin can update"
on categories
for update
to authenticated
using (auth.uid() = '6422cae9-41bf-40c6-a53b-b612b3cf6d35');

create policy "Only admin can delete"
on categories
for delete
to authenticated
using (auth.uid() = '6422cae9-41bf-40c6-a53b-b612b3cf6d35');
