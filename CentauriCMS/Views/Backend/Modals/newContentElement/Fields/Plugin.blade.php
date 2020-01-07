<select class="mdb-select md-form" id="plugin">
    <option value="" selected disabled>Please select a plugin</option>

    @if(isset($additionalData))
        @foreach($additionalData["plugins"] as $pluginId => $pluginArr)
            @foreach($pluginArr as $pluginLabel => $pluginValue)
                @if($value ?? "" == $pluginValue)
                    <option value="{{ $pluginValue }}" selected>{{ $pluginLabel }}</option>
                @else
                    <option value="{{ $pluginValue }}">{{ $pluginLabel }}</option>
                @endif
            @endforeach
        @endforeach
    @endif
</select>
